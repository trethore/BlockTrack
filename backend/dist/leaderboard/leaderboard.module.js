"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardModule = void 0;
const common_1 = require("@nestjs/common");
const leaderboard_service_1 = require("./leaderboard.service");
const leaderboard_resolver_1 = require("./leaderboard.resolver");
const prisma_module_1 = require("../prisma/prisma.module");
const token_repository_interface_1 = require("./ports/token.repository.interface");
const prisma_token_repository_1 = require("../infrastructure/repositories/prisma-token.repository");
let LeaderboardModule = class LeaderboardModule {
};
exports.LeaderboardModule = LeaderboardModule;
exports.LeaderboardModule = LeaderboardModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [
            leaderboard_resolver_1.LeaderboardResolver,
            leaderboard_service_1.LeaderboardService,
            {
                provide: token_repository_interface_1.ITokenRepository,
                useClass: prisma_token_repository_1.PrismaTokenRepository,
            },
        ],
    })
], LeaderboardModule);
//# sourceMappingURL=leaderboard.module.js.map