import { CreateFacebookPostDto } from './dto/create-facebook-post.dto';
import { PostsService } from './post.service';
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(AuthGuard) // Requiere autenticación
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Publicar en Facebook
   */
  @Post('facebook')
  @ApiOperation({ summary: 'Publicar un mensaje en Facebook' })
  @ApiResponse({ status: 201, description: 'Publicación creada exitosamente' })
  @ApiResponse({ status: 404, description: 'Facebook no está conectado' })
  @ApiResponse({ status: 400, description: 'Error al publicar' })
  async publishToFacebook(
    @ActiveUser() user: UserActiveInterface,
    @Body() createPostDto: CreateFacebookPostDto,
  ) {
    return await this.postsService.publishToFacebook(user.id, createPostDto);
  }

  /**
   * Obtener información de la cuenta de Facebook conectada
   */
  @Get('facebook/account')
  @ApiOperation({ summary: 'Obtener información de la cuenta de Facebook conectada' })
  async getFacebookAccount(@ActiveUser() user: UserActiveInterface) {
    return await this.postsService.getFacebookAccountInfo(user.id);
  }
}