export interface SwaggerauthTokenModel {
    type: String;
    name: String;
    in: String;
}

export interface SwaggerSecurityDefinitionModel {
    authtoken: SwaggerauthTokenModel;
}

export interface SwaggerTagModel {
    name: String;
    description: String;
}

export interface SwaggerInfoModel {
    description: String;
    version: String;
    title: String;
}

export interface SwaggerModel {
    swagger: String;
    paths: any;
    info: SwaggerInfoModel;
    host: String;
    basePath: String;
    tags: Array<SwaggerTagModel>;
    schemes: Array<string>;
    securityDefinitions: SwaggerSecurityDefinitionModel;
}
