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
exports.UserResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const create_user_input_1 = require("./dto/create-user.input");
const update_user_input_1 = require("./dto/update-user.input");
const create_user_use_case_1 = require("../../use-cases/create-user.use-case");
const get_user_use_case_1 = require("../../use-cases/get-user.use-case");
const update_user_use_case_1 = require("../../use-cases/update-user.use-case");
const delete_user_use_case_1 = require("../../use-cases/delete-user.use-case");
const jwt_auth_guard_1 = require("../../../infrastructure/auth/jwt-auth.guard");
const current_user_decorator_1 = require("../../../infrastructure/auth/current-user.decorator");
let UserResolver = class UserResolver {
    createUserUseCase;
    getUserUseCase;
    updateUserUseCase;
    deleteUserUseCase;
    constructor(createUserUseCase, getUserUseCase, updateUserUseCase, deleteUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.getUserUseCase = getUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }
    async createUser(createUserData) {
        const user = await this.createUserUseCase.execute(createUserData);
        return user;
    }
    async getMe(user) {
        const foundUser = await this.getUserUseCase.execute({ userId: user.id });
        return foundUser;
    }
    async updateUser(updateUserData, user) {
        const updatedUser = await this.updateUserUseCase.execute({
            userIdToUpdate: updateUserData.id,
            authenticatedUserId: user.id,
            ...updateUserData,
        });
        return updatedUser;
    }
    async deleteUser(id, user) {
        await this.deleteUserUseCase.execute({
            userIdToDelete: id,
            authenticatedUserId: user.id,
        });
        return id;
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.UserEntity, { description: 'Creates a new user account' }),
    __param(0, (0, graphql_1.Args)('createUserData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_input_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => user_entity_1.UserEntity, { name: 'me', description: 'Gets the currently authenticated user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => user_entity_1.UserEntity, { description: 'Updates the authenticated user profile' }),
    __param(0, (0, graphql_1.Args)('updateUserData')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_input_1.UpdateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => graphql_1.ID, { description: 'Deletes the authenticated user profile' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
exports.UserResolver = UserResolver = __decorate([
    (0, graphql_1.Resolver)(() => user_entity_1.UserEntity),
    __metadata("design:paramtypes", [create_user_use_case_1.CreateUserUseCase,
        get_user_use_case_1.GetUserUseCase,
        update_user_use_case_1.UpdateUserUseCase,
        delete_user_use_case_1.DeleteUserUseCase])
], UserResolver);
//# sourceMappingURL=user.resolver.js.map