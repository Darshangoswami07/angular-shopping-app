import { bootstrapApplication } from "@angular/platform-browser"
import { provideAnimations } from "@angular/platform-browser/animations"
import { AppComponent } from "./app/app.component"
import { CartService } from "./app/services/cart.service"

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), CartService],
}).catch((err) => console.error(err))
