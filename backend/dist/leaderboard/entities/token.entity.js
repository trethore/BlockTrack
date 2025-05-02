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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_scalars_1 = require("graphql-scalars");
let TokenEntity = class TokenEntity {
    id;
    symbol;
    name;
    rank;
    priceUSD;
    marketCapUsd;
    volume24hUsd;
    circulatingSupply;
    totalSupply;
    maxSupply;
    percentChange1h;
    percentChange24h;
    percentChange7d;
    percentChange30d;
    percentChange1y;
    marketCapChange24h;
    lastUpdated;
};
exports.TokenEntity = TokenEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], TokenEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TokenEntity.prototype, "symbol", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TokenEntity.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TokenEntity.prototype, "rank", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TokenEntity.prototype, "priceUSD", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "marketCapUsd", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "volume24hUsd", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLBigInt, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "circulatingSupply", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLBigInt, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "totalSupply", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLBigInt, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "maxSupply", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "percentChange1h", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "percentChange24h", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "percentChange7d", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "percentChange30d", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "percentChange1y", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "marketCapChange24h", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLDateTime, { nullable: true }),
    __metadata("design:type", Object)
], TokenEntity.prototype, "lastUpdated", void 0);
exports.TokenEntity = TokenEntity = __decorate([
    (0, graphql_1.ObjectType)({ description: 'Represents a cryptocurrency token' })
], TokenEntity);
//# sourceMappingURL=token.entity.js.map