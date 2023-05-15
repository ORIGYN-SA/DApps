import { ReactNode } from 'react';
import { CandyClass, CandyProperty, CandyType, PropertyWithId } from '@dapp/common-types';
export interface CopyToClipBoard {
    stringToCopy: string;
    buttonText: string;
}

export interface MenuListElements {
    content: ListItem[];
    children: ReactNode;
}

export interface ListItem {
    listItemText: string;
    listItemFunction: () => void;
    listItemIcon?: JSX.Element;
}

export interface EditableCandyClass {
    Class: Array<PropertyWithId>;
}

export interface CandyDataEditorProps {
    existingCandyClass?: CandyClass;
    readOnly?: boolean;
}

export interface CandyClassEditor {
    addPropertyToCandyClass?: (property: PropertyWithId) => void;
    candyType?: CandyType;
    editExistingProperty?: (updatedProperty: CandyProperty, propertyIndex: number) => void;
    editorMode: EditorMode;
    property?: CandyProperty;
    propertyIndex?: number;
}

export type EditorMode = "create" | "edit" | null;

