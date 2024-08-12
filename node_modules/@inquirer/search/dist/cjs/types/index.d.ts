import { Separator, type Theme } from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';
type SearchTheme = {
    icon: {
        cursor: string;
    };
    style: {
        disabled: (text: string) => string;
        searchTerm: (text: string) => string;
        description: (text: string) => string;
    };
    helpMode: 'always' | 'never' | 'auto';
};
type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};
declare const _default: <Value>(config: {
    message: string;
    source: (term: string | undefined, opt: {
        signal: AbortSignal;
    }) => readonly (Separator | Choice<Value>)[] | Promise<readonly (Separator | Choice<Value>)[]>;
    pageSize?: number | undefined;
    theme?: PartialDeep<Theme<SearchTheme>> | undefined;
}, context?: import("@inquirer/type").Context) => import("@inquirer/type").CancelablePromise<Value>;
export default _default;
export { Separator } from '@inquirer/core';
