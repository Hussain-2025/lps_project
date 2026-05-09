# Backend API Notes

Base URL: `/api/v1`

Implemented now:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/google`
- `GET /auth/google/callback`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me`
- `GET /users/me/export`
- `GET /users`
- `POST /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `POST /admissions`
- `GET /admissions`
- `GET /admissions/:id`
- `PATCH /admissions/:id/status`
- `GET /admissions/export`
- `GET /notices`
- `GET /notices/:id`
- `POST /notices`
- `PATCH /notices/:id`
- `DELETE /notices/:id`
- `GET /gallery/albums`
- `GET /gallery/albums/:albumId`
- `POST /gallery/albums`
- `POST /gallery/media`
- `DELETE /gallery/media/:id`
- `POST /contact`
- `GET /health`
- `GET /ready`

Shared response shapes:

```json
{ "success": true, "data": {} }
```

```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable message" } }
```

```json
{
  "success": true,
  "data": [],
  "pagination": { "total": 0, "page": 1, "limit": 20, "totalPages": 0 }
}
```

