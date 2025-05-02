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
exports.LoginUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../domain/ports/user.repository.interface");
const auth_service_interface_1 = require("../domain/ports/auth.service.interface");
let LoginUserUseCase = class LoginUserUseCase {
    userRepository;
    authService;
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async execute(command) {
        const user = (await this.userRepository.findByEmail(command.emailOrUsername)) ||
            (await this.userRepository.findByUsername(command.emailOrUsername));
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.authService.comparePasswords(command.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const accessToken = await this.authService.generateToken(user);
        return { accessToken };
    }
};
exports.LoginUserUseCase = LoginUserUseCase;
exports.LoginUserUseCase = LoginUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __param(1, (0, common_1.Inject)(auth_service_interface_1.IAuthService)),
    __metadata("design:paramtypes", [Object, Object])
], LoginUserUseCase);
//# sourceMappingURL=login-user.use-case.js.map