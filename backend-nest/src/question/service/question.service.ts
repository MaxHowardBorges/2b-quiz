import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entity/question.entity';
import { Repository } from 'typeorm';
import { Answer } from '../entity/answer.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly postRepository: Repository<Answer>,
  ) {}

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async findAllWithQuestion(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['answers'] });
  }
}
