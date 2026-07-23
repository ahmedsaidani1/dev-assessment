package repositories;

import models.Task;
import play.db.jpa.JPAApi;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletionStage;
import java.util.function.Function;

import static java.util.concurrent.CompletableFuture.supplyAsync;

public class TaskRepository {
    
    private final JPAApi jpaApi;
    private final DatabaseExecutionContext executionContext;
    
    @Inject
    public TaskRepository(JPAApi jpaApi, DatabaseExecutionContext executionContext) {
        this.jpaApi = jpaApi;
        this.executionContext = executionContext;
    }
    
    public CompletionStage<List<Task>> list() {
        return supplyAsync(() -> wrap(em -> {
            TypedQuery<Task> query = em.createQuery("SELECT t FROM Task t ORDER BY t.createdAt DESC", Task.class);
            return query.getResultList();
        }), executionContext);
    }
    
    public CompletionStage<Optional<Task>> findById(Long id) {
        return supplyAsync(() -> wrap(em -> Optional.ofNullable(em.find(Task.class, id))), executionContext);
    }
    
    public CompletionStage<Task> create(Task task) {
        return supplyAsync(() -> wrap(em -> {
            em.persist(task);
            return task;
        }), executionContext);
    }
    
    public CompletionStage<Optional<Task>> update(Long id, Task taskData) {
        return supplyAsync(() -> wrap(em -> {
            Task task = em.find(Task.class, id);
            if (task != null) {
                task.setTitle(taskData.getTitle());
                task.setDescription(taskData.getDescription());
                task.setStatus(taskData.getStatus());
                em.merge(task);
                return Optional.of(task);
            }
            return Optional.empty();
        }), executionContext);
    }
    
    public CompletionStage<Boolean> delete(Long id) {
        return supplyAsync(() -> wrap(em -> {
            Task task = em.find(Task.class, id);
            if (task != null) {
                em.remove(task);
                return true;
            }
            return false;
        }), executionContext);
    }
    
    private <T> T wrap(Function<EntityManager, T> function) {
        return jpaApi.withTransaction(function);
    }
}
