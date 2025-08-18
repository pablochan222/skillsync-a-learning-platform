import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Learner } from 'src/learner/learner.entity';
import { Instructor } from 'src/instructor/instructor.entity';
import { LearnerModule } from 'src/learner/learner.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret : 'SuperSecret1024',
      signOptions: {
        expiresIn : 3600,
      }
    }),
    TypeOrmModule.forFeature([Learner, Instructor]),
    LearnerModule,
    InstructorModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
