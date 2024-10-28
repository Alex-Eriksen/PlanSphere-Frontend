import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from "@angular/common/http";
import { SystemLanguage } from "./shared/enums/system-language.enum";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { keycloakInitializer } from "./core/authentication/keycloak-initializer";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(routes, withComponentInputBinding(), withRouterConfig({ paramsInheritanceStrategy: "always" })),
      provideHttpClient(
          withFetch()
      ),
      {
          provide: APP_INITIALIZER,
          useFactory: keycloakInitializer,
          multi: true,
          deps: [KeycloakService],
      },
      importProvidersFrom(
          KeycloakAngularModule,
          HttpClientModule,
          TranslateModule.forRoot({
              defaultLanguage: SystemLanguage.English,
              useDefaultLang: true,
              loader: {
                  provide: TranslateLoader,
                  useFactory: HttpLoaderFactory,
                  deps: [HttpClient],
              },
          }),
      )
  ],

};
