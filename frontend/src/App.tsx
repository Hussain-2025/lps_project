import { Navigate, Route, Routes } from "react-router-dom";

import { RequireAuth } from "./components/RequireAuth";
import { AdminLayout, PublicLayout } from "./components/Layout";
import { AboutPage, AcademicsPage, ActivitiesPage, ERPPlaceholderPage } from "./pages/StaticPages";
import { AdmissionPage } from "./pages/Admission";
import { AdminDashboardPage, ManageAdmissionsPage, ManageGalleryPage, ManageNoticesPage } from "./pages/Admin";
import { CommunityPage, NoticeDetailPage } from "./pages/Community";
import { ContactPage } from "./pages/Contact";
import { ERPLoginPage } from "./pages/ERPLogin";
import { GalleryAlbumPage, GalleryPage } from "./pages/Gallery";
import { HomePage } from "./pages/Home";

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:albumId" element={<GalleryAlbumPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/notices/:id" element={<NoticeDetailPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/erp/login" element={<ERPLoginPage />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={["admin", "super_admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/admissions" element={<ManageAdmissionsPage />} />
          <Route path="/admin/notices" element={<ManageNoticesPage />} />
          <Route path="/admin/gallery" element={<ManageGalleryPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth allowedRoles={["student"]} />}>
        <Route path="/erp/student" element={<ERPPlaceholderPage title="Student Dashboard" />} />
      </Route>
      <Route element={<RequireAuth allowedRoles={["parent"]} />}>
        <Route path="/erp/parent" element={<ERPPlaceholderPage title="Parent Dashboard" />} />
      </Route>
      <Route element={<RequireAuth allowedRoles={["teacher"]} />}>
        <Route path="/erp/teacher" element={<ERPPlaceholderPage title="Teacher Dashboard" />} />
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
