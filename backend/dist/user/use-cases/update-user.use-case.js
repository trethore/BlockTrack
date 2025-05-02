"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../domain/ports/user.repository.interface");
const auth_service_interface_1 = require("../domain/ports/auth.service.interface");
let UpdateUserUseCase = class UpdateUserUseCase {
    userRepository;
    authService;
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async execute(command) {
        if (command.userIdToUpdate !== command.authenticatedUserId) {
            throw new common_1.ForbiddenException('You can only update your own profile');
        }
        const existingUser = await this.userRepository.findById(command.userIdToUpdate);
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const updateData = {};
        if (command.email !== undefined && command.email !== existingUser.email) {
            const emailExists = await this.userRepository.findByEmail(command.email);
            if (emailExists) {
                throw new common_1.ConflictException('Email already exists');
            }
            updateData.email = command.email;
        }
        if (command.username !== undefined && command.username !== existingUser.username) {
            const usernameExists = await this.userRepository.findByUsername(command.username);
            if (usernameExists) {
                throw new common_1.ConflictException('Username already exists');
            }
            updateData.username = command.username;
        }
        if (command.password !== undefined) {
            updateData.passwordHash = await this.authService.hashPassword(command.password);
        }
        if (Object.keys(updateData).length === 0) {
            return existingUser;
        }
        const updatedUser = await this.userRepository.update(command.userIdToUpdate, updateData);
        return updatedUser;
    }
};
exports.UpdateUserUseCase = UpdateUserUseCase;
exports.UpdateUserUseCase = UpdateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __param(1, (0, common_1.Inject)(auth_service_interface_1.IAuthService)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateUserUseCase);
//# sourceMappingURL=update-user.use-case.js.map