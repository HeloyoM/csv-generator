import { Module, Scope } from "@nestjs/common"
import { CsvController } from "./csv.controller"
import { DatabaseModule } from "src/database/database.module"
import { CsvSeed } from "./csv.seed"

@Module({
    imports: [
        DatabaseModule.register(Scope.REQUEST)
    ],
    controllers: [CsvController],
    providers: [CsvSeed]
})

export class CsvModule { }