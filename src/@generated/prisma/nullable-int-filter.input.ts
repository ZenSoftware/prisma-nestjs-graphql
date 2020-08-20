import { InputType, Int, Field } from '@nestjs/graphql';

@InputType({})
export class NullableIntFilter {
    @Field(() => Int, {
        nullable: true,
        description: undefined,
    })
    equals?: number | null;

    @Field(() => NullableIntFilter, {
        nullable: true,
        description: undefined,
    })
    not?: NullableIntFilter | null;

    @Field(() => [Int], {
        nullable: true,
        description: undefined,
    })
    in?: number[] | null;

    @Field(() => [Int], {
        nullable: true,
        description: undefined,
    })
    notIn?: number[] | null;

    @Field(() => Int, {
        nullable: true,
        description: undefined,
    })
    lt?: number | null;

    @Field(() => Int, {
        nullable: true,
        description: undefined,
    })
    lte?: number | null;

    @Field(() => Int, {
        nullable: true,
        description: undefined,
    })
    gt?: number | null;

    @Field(() => Int, {
        nullable: true,
        description: undefined,
    })
    gte?: number | null;
}
