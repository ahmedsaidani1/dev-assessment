import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';

@Controller('api/tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    this.logger.log('[NestJS] POST /api/tasks - Creating task via NestJS');
    return this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    this.logger.log('[NestJS] GET /api/tasks - Fetching all tasks');
    return this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task | null> {
    this.logger.log(`[NestJS] GET /api/tasks/${id} - Fetching task`);
    return this.taskService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Task>,
  ): Promise<Task | null> {
    this.logger.log(`[NestJS] PUT /api/tasks/${id} - Updating task`);
    return this.taskService.update(+id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`[NestJS] DELETE /api/tasks/${id} - Deleting task`);
    return this.taskService.remove(+id);
  }
}
