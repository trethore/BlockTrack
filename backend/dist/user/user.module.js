"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_resolver_1 = require("./interface-adapters/graphql/user.resolver");
const auth_resolver_1 = require("./interface-adapters/graphql/auth.resolver");
const prisma_module_1 = require("../prisma/prisma.module");
const user_repository_interface_1 = require("./domain/ports/user.repository.interface");
const prisma_user_repository_1 = require("../infrastructure/repositories/prisma-user.repository");
const create_user_use_case_1 = require("./use-cases/create-user.use-case");
const login_user_use_case_1 = require("./use-cases/login-user.use-case");
const get_user_use_case_1 = require("./use-cases/get-user.use-case");
const update_user_use_case_1 = require("./use-cases/update-user.use-case");
const delete_user_use_case_1 = require("./use-cases/delete-user.use-case");
const auth_module_1 = require("../infrastructure/auth/auth.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        providers: [
            {
                provide: user_repository_interface_1.IUserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            create_user_use_case_1.CreateUserUseCase,
            login_user_use_case_1.LoginUserUseCase,
            get_user_use_case_1.GetUserUseCase,
            update_user_use_case_1.UpdateUserUseCase,
            delete_user_use_case_1.DeleteUserUseCase,
            user_resolver_1.UserResolver,
            auth_resolver_1.AuthResolver,
        ],
        exports: [],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map