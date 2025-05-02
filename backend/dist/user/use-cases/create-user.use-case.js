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
exports.CreateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../domain/ports/user.repository.interface");
const auth_service_interface_1 = require("../domain/ports/auth.service.interface");
let CreateUserUseCase = class CreateUserUseCase {
    userRepository;
    authService;
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async execute(command) {
        const existingUser = await this.userRepository.findByEmail(command.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const existingUsername = await this.userRepository.findByUsername(command.username);
        if (existingUsername) {
            throw new common_1.ConflictException('Username already exists');
        }
        const passwordHash = await this.authService.hashPassword(command.password);
        const newUser = await this.userRepository.create({
            email: command.email,
            username: command.username,
            passwordHash,
        });
        return newUser;
    }
};
exports.CreateUserUseCase = CreateUserUseCase;
exports.CreateUserUseCase = CreateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __param(1, (0, common_1.Inject)(auth_service_interface_1.IAuthService)),
    __metadata("design:paramtypes", [Object, Object])
], CreateUserUseCase);
//# sourceMappingURL=create-user.use-case.js.map