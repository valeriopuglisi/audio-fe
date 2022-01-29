import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapComponent } from "../../pages/map/map.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { UploadAudioFileComponent } from "src/app/pages/upload-audio-file/upload-audio-file.component";
import { FeaturesComponent } from "src/app/pages/features/features.component";
import { PreprocessingComponent } from "src/app/pages/preprocessing/preprocessing.component";
import { PipelinesComponent } from "src/app/pages/pipelines/pipelines.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "upload-file", component: UploadAudioFileComponent},
  { path: "preprocessing", component: PreprocessingComponent},
  { path: "features", component: FeaturesComponent},  
  { path: "pipelines", component: PipelinesComponent},
  { path: "dashboard", component: DashboardComponent },
  { path: "icons", component: IconsComponent },
  { path: "maps", component: MapComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "user", component: UserComponent },
  { path: "tables", component: TablesComponent },
  { path: "typography", component: TypographyComponent },
  // { path: "rtl", component: RtlComponent }
];
