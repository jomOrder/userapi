import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserFliter } from './dto/getUserFilter.dto';
import { UserValidationPiples } from './pipes/UserValidationPiples.pipes';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    getUsers(@Query() userFilter: GetUserFliter) {
        if(Object.keys(userFilter).length) return this.usersService.getAllUsers();
    }

    @Get('/:id')
    getUserById(@Param('id') id: string) {
        return this.usersService.getUserByID(id);
    }

    @Post('/email')
    @UsePipes(ValidationPipe)
    registerUserWithEmail(@Body() createUserDto: CreateUserDto) {
        this.usersService.createUser(createUserDto);
    }

    @Post('/phone')
    registerUserWithPhone() {

    }

    @Post('/gmail/outh2')
    registerUserWithGoogle() {

    }

    @Post('/apple')
    registerUserWithApple() {

    }

    @Post('/facebook')
    registerUserWithFacebook() {

    }

    @Post('/verify/code')
    verifyUserPhone() {

    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.removeUser(id);
    }

    @Patch('/:id')
    updateUserInfo(
        @Body('isVerified', UserValidationPiples)
        @Param('id') id: string) {
        return this.usersService.updateUser(id);
    }

}
