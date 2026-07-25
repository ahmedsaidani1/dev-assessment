import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log(
      `[NestJS] Creating new task: ${JSON.stringify(createTaskDto)}`,
    );

    const task = this.taskRepository.create(createTaskDto);
    const savedTask = await this.taskRepository.save(task);

    this.logger.log(`[NestJS] Task created with ID: ${savedTask.id}`);
    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    this.logger.log('[NestJS] Fetching all tasks');
    return this.taskRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Task | null> {
    this.logger.log(`[NestJS] Fetching task with ID: ${id}`);
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Task>): Promise<Task | null> {
    this.logger.log(
      `[NestJS] Updating task ${id}: ${JSON.stringify(updateData)}`,
    );

    await this.taskRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`[NestJS] Deleting task with ID: ${id}`);
    await this.taskRepository.delete(id);
  }
}
