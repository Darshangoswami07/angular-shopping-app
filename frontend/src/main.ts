import { bootstrapApplication } from "@angular/platform-browser"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideHttpClient } from "@angular/common/http"
import { AppComponent } from "./app/app.component"
import { CartService } from "./app/services/cart.service"
import { AuthService } from "./app/services/auth.service"

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), provideHttpClient(), CartService, AuthService],
}).catch((err) => console.error(err))
