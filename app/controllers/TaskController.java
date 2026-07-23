package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import models.Task;
import play.libs.Json;
import play.mvc.*;
import repositories.TaskRepository;

import javax.inject.Inject;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class TaskController extends Controller {
    
    private final TaskRepository taskRepository;
    
    @Inject
    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    public CompletionStage<Result> getTasks() {
        return taskRepository.list()
            .thenApply(tasks -> ok(Json.toJson(tasks)));
    }
    
    public CompletionStage<Result> getTask(Long id) {
        return taskRepository.findById(id)
            .thenApply(optionalTask -> {
                if (optionalTask.isPresent()) {
                    return ok(Json.toJson(optionalTask.get()));
                } else {
                    return notFound(Json.toJson(new ErrorResponse("Task not found")));
                }
            });
    }
    
    public CompletionStage<Result> createTask(Http.Request request) {
        JsonNode json = request.body().asJson();
        if (json == null) {
            return CompletableFuture.completedFuture(
                badRequest(Json.toJson(new ErrorResponse("Expecting JSON data")))
            );
        }
        
        Task task = Json.fromJson(json, Task.class);
        
        if (task.getTitle() == null || task.getTitle().isEmpty()) {
            return CompletableFuture.completedFuture(
                badRequest(Json.toJson(new ErrorResponse("Title is required")))
            );
        }
        
        return taskRepository.create(task)
            .thenApply(createdTask -> created(Json.toJson(createdTask)));
    }
    
    public CompletionStage<Result> updateTask(Http.Request request, Long id) {
        JsonNode json = request.body().asJson();
        if (json == null) {
            return CompletableFuture.completedFuture(
                badRequest(Json.toJson(new ErrorResponse("Expecting JSON data")))
            );
        }
        
        return taskRepository.findById(id)
            .thenCompose(optionalTask -> {
                if (optionalTask.isEmpty()) {
                    return CompletableFuture.completedFuture(
                        notFound(Json.toJson(new ErrorResponse("Task not found")))
                    );
                }
                
                Task existingTask = optionalTask.get();
                
                // Update only provided fields
                if (json.has("title")) {
                    existingTask.setTitle(json.get("title").asText());
                }
                if (json.has("description")) {
                    existingTask.setDescription(json.get("description").asText());
                }
                if (json.has("status")) {
                    existingTask.setStatus(json.get("status").asText());
                }
                
                return taskRepository.update(id, existingTask)
                    .thenApply(updated -> ok(Json.toJson(updated.get())));
            });
    }
    
    public CompletionStage<Result> deleteTask(Long id) {
        return taskRepository.delete(id)
            .thenApply(deleted -> {
                if (deleted) {
                    return noContent();
                } else {
                    return notFound(Json.toJson(new ErrorResponse("Task not found")));
                }
            });
    }
    
    // Helper class for error responses
    public static class ErrorResponse {
        public String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
    }
}
