import {PrismaClient} from "@prisma/client";
import {singleton} from "tsyringe";

singleton()(PrismaClient);
