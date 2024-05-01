import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../enviornments/enviornment'
import { ApiConfig } from '../../models/api-config'

@Injectable({
    providedIn: 'root'
})
export class EnvService {



    private api = null;
    clientId!:string;

    constructor(private http: HttpClient) {

    }

    apiConfig(): Observable<any> {

        if (this.api != null) {
            return of(this.api);
        }

        return this.http.get<any>('/assets/api/api-config.json')
            .pipe(tap(api => this.api = api));

    }

    getUrlForProvider(module: string): Observable<ApiConfig> {
        return this.apiConfig()
            .pipe(map(apiConfig => {
                const config: any = new ApiConfig(apiConfig.api[module]);
                if (config.baseUrl == null) {
                    config.baseUrl = apiConfig.baseUrl;
                }
                return config
            }));
    }

    buildFeatureUrl(module: string, feature: string, pathVariables: any[]): Observable<string> {
        return this.getUrlForProvider(module)
            .pipe(
                map(config => config.featureUrl(feature)),
                map(url => this.replaceParams(url, pathVariables))
            );

    }

    replaceParams(template: string, params: any[]) {
        let result = template;
        for (const param of params) {
            result = result.replace(/{}/, param);
        }
        return result;
    }

    getAuthClientId(): Observable<string> {
        const env: any = environment;
        return this.apiConfig()
            .pipe(
                map(config => config.authDetails.authClientId)
            );
    }
    getAuthConfigDetails(): any{
      const env: any = environment;
      return this.apiConfig()
          .pipe(
              map(config =>{console.log("AuthUrl",config.authDetails); return config.authDetails})
          );
  }



}