type ToGraphqlImportTypeArgs = {
    isId?: boolean;
    type: string;
    kind: string;
};

export function toGraphqlImportType(args: ToGraphqlImportTypeArgs) {
    const { isId, type, kind } = args;
    let name = type;
    if (isId) {
        return { name: 'ID', moduleSpecifier: '@nestjs/graphql' };
    }
    if (name === 'Int' || name === 'Float') {
        return { name, moduleSpecifier: '@nestjs/graphql' };
    }
    if (kind === 'scalar' && type === 'Json') {
        return { name: 'GraphQLJSON', moduleSpecifier: 'graphql-type-json' };
    }
    if (name === 'DateTime') {
        name = 'String';
    }
    return { name, moduleSpecifier: undefined };
}

export function typeFilterVariation(name: string) {
    return scalarFilters.get(name) || name;
}

export function isFilterVariation(name: string): boolean {
    return (
        filterVariations('String').includes(name) ||
        filterVariations('Int').includes(name) ||
        filterVariations('Boolean').includes(name) ||
        filterVariations('DateTime').includes(name)
    );
}

function filterVariations(type: 'String' | 'Int' | 'Boolean' | 'DateTime') {
    return [`${type}NullableFilter`, `Nested${type}NullableFilter`, `Nested${type}Filter`];
}

const scalarFilters = new Map<string, string>([
    ...filterVariations('Int')
        .concat('NullableIntFilter')
        .map((key) => [key, 'IntFilter'] as [string, string]),
    ...filterVariations('String')
        .concat('NullableStringFilter')
        .map((key) => [key, 'StringFilter'] as [string, string]),
    ...filterVariations('Boolean')
        .concat('NullableBooleanFilter')
        .map((key) => [key, 'BooleanFilter'] as [string, string]),
    ...filterVariations('DateTime')
        .concat('NullableDateTimeFilter')
        .map((key) => [key, 'DateTimeFilter'] as [string, string]),
    ['BoolNullableFilter', 'BooleanFilter'],
    ['NestedBoolNullableFilter', 'BooleanFilter'],
    ['NestedBoolFilter', 'BooleanFilter'],
]);

/**
 * Returns typescript property type.
 */
export function toPropertyType(field: { type: string; kind: string }): string {
    for (const [key, result] of patterns.entries()) {
        if (key.kind === field.kind && key.type(field.type)) {
            return result(field);
        }
    }
    // console.log('field', field);
    throw new TypeError(`Cannot get type from ${field.kind}/${field.type}`);
}

const patterns = new Map([
    [{ type: (type: string) => type === 'String', kind: 'scalar' }, () => 'string'],
    [{ type: (type: string) => type === 'DateTime', kind: 'scalar' }, () => 'string'],
    [{ type: (type: string) => type === 'Float', kind: 'scalar' }, () => 'number'],
    [{ type: (type: string) => type === 'Int', kind: 'scalar' }, () => 'number'],
    [{ type: (type: string) => type === 'Boolean', kind: 'scalar' }, () => 'boolean'],
    [{ type: (type: string) => type === 'Json', kind: 'scalar' }, () => 'object'],
    // TODO: Need GraphQLUnionType as input type - https://github.com/graphql/graphql-js/issues/207
    [
        {
            type: (type: string) => ['StringFilter'].includes(type),
            kind: 'object',
        },
        (field: { type: string }) => `string | ${field.type}`,
    ],
    [
        {
            type: (type: string) => ['IntFilter'].includes(type),
            kind: 'object',
        },
        (field: { type: string }) => `number | ${field.type}`,
    ],
    [
        {
            type: (type: string) => ['BooleanFilter'].includes(type),
            kind: 'object',
        },
        (field: { type: string }) => `boolean | ${field.type}`,
    ],
    [{ type: () => true, kind: 'object' }, (field: { type: string }) => field.type],
    [{ type: () => true, kind: 'enum' }, (field: { type: string }) => field.type],
    [{ type: () => true, kind: 'scalar' }, (field: { type: string }) => field.type],
]);
