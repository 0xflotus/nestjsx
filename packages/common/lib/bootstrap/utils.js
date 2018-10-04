"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const values = require("lodash.values");
const sortBy = require("lodash.sortby");
const callsite = require("callsite");
const glob = require("glob");
const interfaces_1 = require("../interfaces");
exports.getCallerPath = () => path_1.dirname(callsite()
    .find((s) => s.getFunctionName() === null)
    .getFileName());
exports.getInjectables = (path, files) => glob
    .sync(`${path}/**/*.+(${files.join('|')}){.ts,.js}`)
    .map((m) => require(m))
    .reduce((a, m) => [...a, ...values(m)], []);
exports.getAppInjectables = (path, files) => sortBy(exports.getInjectables(path, files), 'order').map((m) => m.provider);
exports.getEntities = (path, files, ormPackage) => {
    if (ormPackage) {
        try {
            const orm = require(ormPackage);
            const entities = exports.getInjectables(path, files);
            switch (ormPackage) {
                case interfaces_1.OrmPackage.TypeOrm: {
                    return orm.TypeOrmModule.forFeature(entities);
                }
                case interfaces_1.OrmPackage.Mongoose: {
                    return orm.MongooseModule.forFeature(entities);
                }
                default: {
                    return undefined;
                }
            }
        }
        catch (error) {
            throw new Error(`${ormPackage} must be instaled`);
        }
    }
    return undefined;
};
//# sourceMappingURL=utils.js.map