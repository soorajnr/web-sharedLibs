export class ApiConfig {
    module!: string;
    baseUrl!: string;
    features!: any[];
    
    constructor(config: any) {
        if (config) {
            this.module = config.module;
            this.baseUrl = config.baseUrl;
            this.features = config.features == null ? [] : config.features;
        }
    }  
    
    featureUrl(featureName: string) {
        const feature = this.features.find(item => item.name === featureName);
        if (feature != null) {
            return this.baseUrl+feature.path;
        }
        return this.baseUrl;
    }    
}