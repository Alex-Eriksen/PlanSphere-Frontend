import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from "@angular/common/http";
import { SystemLanguage } from "./shared/enums/system-language.enum";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(routes, withComponentInputBinding(), withRouterConfig({ paramsInheritanceStrategy: "always" })),
      provideHttpClient(
          withFetch()
      ),
      importProvidersFrom(
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
