import { DMMF as PrismaDMMF } from '@prisma/client/runtime/dmmf-types';
import assert from 'assert';
import { ClassDeclaration, SourceFile } from 'ts-morph';

import { generateClass, generateClassProperty } from './generate-class';
import { generateDecorator } from './generate-decorator';
import { generateGraphqlImport } from './generate-graphql-import';
import { generateProjectImport } from './generate-project-import';
import { toGraphqlImportType, toPropertyType } from './type-utils';

type GenerateInputArgs = {
    inputType: PrismaDMMF.InputType;
    sourceFile: SourceFile;
    model: PrismaDMMF.Model | undefined;
    projectFilePath(data: { name: string; type: string }): string;
};

export function generateInput(args: GenerateInputArgs) {
    const { inputType, sourceFile, projectFilePath, model } = args;
    const className = inputType.name;
    const classDeclaration = generateClass({
        sourceFile,
        decorator: {
            name: 'InputType',
            properties: [],
        },
        name: className,
    });
    generateGraphqlImport({ name: 'Field', sourceFile, moduleSpecifier: '@nestjs/graphql' });
    for (const field of inputType.fields) {
        // console.log('field', field);
        const inputType = getMatchingInputType(field.inputType);
        const modelField = model?.fields.find((f) => f.name === field.name);
        const nullable =
            modelField?.isRequired !== undefined ? !modelField.isRequired : inputType.isNullable;
        const propertyType = getPropertyType({ field, nullable });
        generateInputProperty({
            inputType,
            propertyType,
            classDeclaration,
            sourceFile,
            projectFilePath,
            className,
            name: field.name,
        });
    }
}

type GenerateInputPropertyArgs = {
    name: string;
    inputType: PrismaDMMF.SchemaArgInputType;
    sourceFile: SourceFile;
    projectFilePath(data: { name: string; type: string }): string;
    className: string;
    classDeclaration: ClassDeclaration;
    propertyType: string;
};

function generateInputProperty(args: GenerateInputPropertyArgs) {
    const { inputType, sourceFile, className, classDeclaration, projectFilePath } = args;
    const propertyDeclaration = generateClassProperty({
        name: args.name,
        type: args.propertyType,
        classDeclaration,
        isReadOnly: false,
        isRequired: false,
    });
    let fieldType = getFieldType(inputType);
    if (inputType.kind === 'scalar') {
        const importType = toGraphqlImportType({
            kind: inputType.kind,
            type: fieldType,
            isId: false,
        });
        // Override return field type value
        fieldType = importType.name;
        generateGraphqlImport({
            sourceFile,
            ...importType,
        });
    } else if (inputType.kind === 'object' && inputType.type !== className) {
        generateProjectImport({
            name: fieldType,
            type: 'input',
            sourceFile,
            projectFilePath,
        });
    } else if (inputType.kind === 'enum') {
        generateProjectImport({
            name: fieldType,
            type: 'enum',
            sourceFile,
            projectFilePath,
        });
    }
    generateDecorator({
        propertyDeclaration,
        fieldType: inputType.isList ? `[${fieldType}]` : fieldType,
        nullable: true,
    });
}

type GetPropertyTypeArgs = {
    field: PrismaDMMF.SchemaArg;
    nullable: boolean;
};

function getPropertyType(args: GetPropertyTypeArgs): string {
    const { field, nullable } = args;
    const inputTypes = field.inputType;
    let result = inputTypes
        .map((inputType) => {
            const type = getTypeName(inputType);
            return toPropertyType({ kind: inputType.kind, type });
        })
        .join(' | ');
    if (inputTypes.every((t) => t.isList)) {
        if (['AND', 'NOT', 'in', 'notIn'].includes(field.name)) {
            result = `${result} | Array<${result}>`;
        } else {
            result = `Array<${result}>`;
        }
    }
    if (!inputTypes.find((t) => t.type === 'null')) {
        if (nullable) {
            result = `${result} | null`;
        }
    }
    return result;
}

function getMatchingInputType(inputTypes: PrismaDMMF.SchemaArgInputType[]) {
    if (inputTypes.length === 1) {
        return inputTypes[0];
    }
    const inputType = inputTypes.find((x) => x.kind === 'object');
    if (inputType) {
        return inputType;
    }
    if (inputTypes.every((t) => t.kind === 'scalar')) {
        const [result] = inputTypes.filter((t) => t.type !== 'null').slice(-1);
        return result;
    }
    // console.log('inputTypes', inputTypes);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new TypeError(`Cannot get matching input type from ${inputTypes.map((x) => x.type)}`);
}

function getFieldType(inputType: PrismaDMMF.SchemaArgInputType) {
    return String(inputType.type);
}

function getTypeName(inputType: PrismaDMMF.SchemaArgInputType) {
    return typeof inputType.type === 'string' ? inputType.type : 'unknown';
}
