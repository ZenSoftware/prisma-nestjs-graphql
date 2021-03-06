import { Field, InputType } from '@nestjs/graphql';

import { CommentUpdateWithoutAuthorDataInput } from './comment-update-without-author-data.input';
import { CommentWhereUniqueInput } from './comment-where-unique.input';

@InputType({})
export class CommentUpdateWithWhereUniqueWithoutAuthorInput {
    @Field(() => CommentWhereUniqueInput, {
        nullable: true,
        description: undefined,
    })
    where?: CommentWhereUniqueInput;

    @Field(() => CommentUpdateWithoutAuthorDataInput, {
        nullable: true,
        description: undefined,
    })
    data?: CommentUpdateWithoutAuthorDataInput;
}
