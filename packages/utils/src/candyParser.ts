
export class CandyValue {
    _candy: any;
    constructor(candy) {
        this._candy = candy;
    }

    getValue() {
        const { Text, Bool, Nat, Array, Class } = this._candy.value;
        return Text ?? Bool ?? Nat ?? Class ?? Array?.thawed;
    }

    getName() {
        return this._candy.name;
    }

    isClassOrArray() {
        const { Array, Class } = this._candy.value;
        return Array || Class || false;
    }
}

export class CandyToJson {
    private _dataClass: any;
    _metadata: any;
    _metadataClass: any;
    _id: any;
    _appsClass: any;
    // index = the index in __ apps.value.Array.thawed where the data sits
    constructor(metadata, index = 0) {
        this._metadata = metadata.metadata.meta.metadata; // i know, right? could be improved
        this._metadataClass = metadata.metadata.meta.metadata.Class;
        this._id = this._findClass('id');
        this._appsClass = this._getClassValue('__apps')[index].Class;
        this._dataClass = this._getClassValue('data', this._appsClass);
    }

    _findClass(_name, level = this._metadataClass) {
        return level.find(({ name }) => name === _name);
    }

    _findAppsClass() { }

    _getClassValue(_name, level = this._metadataClass) {
        return new CandyValue(this._findClass(_name, level)).getValue();
    }

    getFieldValue(_name, language = 'en', level = this._dataClass) {
        const candy = new CandyValue(level.find(({ name }) => name === _name));
        if (!candy.isClassOrArray()) {
            return candy.getValue();
        }

        // TODO: We will need recursivity here for Arrays
        const dataField = new CandyValue(this._findClass('data', candy.getValue()));

        if (!dataField.isClassOrArray()) {
            return dataField.getValue();
        }

        const languageCandy = new CandyValue(this._findClass(language, dataField.getValue()));

        return languageCandy.getValue();
    }

    getAllDataFields() {
        return this._dataClass.reduce((previous, field) => {
            const { name } = field;
            const value = this.getFieldValue(name);
            return {
                ...previous,
                [name]: value,
            };
        }, {});
    }
}
