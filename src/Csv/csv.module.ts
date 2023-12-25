import { Module, Scope } from "@nestjs/common"
import { CsvController } from "./csv.controller"
import { DatabaseModule } from "src/database/database.module"
import { Main } from "./csv.seed"

@Module({
    imports: [
        DatabaseModule.register(Scope.REQUEST)
    ],
    controllers: [CsvController],
    providers: [Main]
})

export class CsvModule { }