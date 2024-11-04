import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { SystemLanguage } from "./shared/enums/system-language.enum";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { authenticationInitializer } from "./core/initializers/authentication.initializer";
import { AuthenticationService } from "./core/features/authentication/services/authentication.service";
import { authenticationInterceptor } from "./core/interceptors/authentication.interceptor";
import { patchRequestInterceptor } from "./core/interceptors/patch.interceptor";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(routes, withComponentInputBinding(), withRouterConfig({ paramsInheritanceStrategy: "always" })),
      provideHttpClient(
          withFetch(),
          withInterceptors([
              authenticationInterceptor,
              patchRequestInterceptor
          ]),
      ),
      importProvidersFrom(
          HttpClientModule,
          TranslateModule.forRoot({
              defaultLanguage: SystemLanguage.Danish,
              useDefaultLang: true,
              loader: {
                  provide: TranslateLoader,
                  useFactory: HttpLoaderFactory,
                  deps: [HttpClient],
              },
          }),
      ),
      {
          provide: APP_INITIALIZER,
          useFactory: authenticationInitializer,
          multi: true,
          deps: [AuthenticationService]
      },
      provideAnimationsAsync()
  ],

};
