"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "@/components/Header/Header";
import { useTranslations } from "next-intl";
import useAuth from "@/hooks/userSerchPage/useAuth";
import useUsers from "@/hooks/userSerchPage/useUsers";

const columns = [
  {
    field: "avatar",
    headerName: "Avatar",
    width: 90,
    renderCell: (params) => (
      <div className="flex items-center justify-center h-full">
        <Avatar alt={params.row.name} src={params.value || "/noavatar.png"} />
      </div>
    ),
    sortable: false,
  },
  { field: "name", headerName: "Name", width: 130 },
  { field: "nickname", headerName: "Nickname", width: 130 },
  { field: "gender", headerName: "Gender", width: 90 },
  { field: "age", headerName: "Age", type: "number", width: 90 },
  {
    field: "isPremium",
    headerName: "Premium",
    width: 120,
    renderCell: (params) => (params.value ? "Yes" : "No"),
  },
];

const UserSearchPage = () => {
  const t = useTranslations("Search");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { currentUserId, loading, setLoading } = useAuth();
  const { users } = useUsers(currentUserId, setLoading);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRowClick = (params) => {
    router.push(`/en/Users/${params.id}`);
  };

  const filteredUsers = users.filter((user) =>
    user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto mt-12 px-3">
        <h2 className="text-2xl font-bold text-[#876447]">
          {t("searchTitle")}
        </h2>
        <TextField
          label={t("searchTextLabel")}
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Paper sx={{ height: 400, width: "100%", mt: 2 }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            sx={{ border: 0 }}
            onRowClick={handleRowClick}
          />
        </Paper>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default UserSearchPage;
