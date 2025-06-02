import React, { useState } from "react";
import {
  Button,
  Container,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
// import { Authenticator } from "@aws-amplify/ui-react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CasinoIcon from "@mui/icons-material/Casino";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import "@aws-amplify/ui-react/styles.css";
import "./css/setting.css";
import NoAccountWarning from "./no-account-warning";
import { randomName } from "./utils/randomName";
import { useAppContext, useGameAccount } from "../context";

function Setting(): React.JSX.Element {
  const { getAllAccounts } = useGameAccount();
  const gameAccounts = getAllAccounts();

  let content = (
    <div className="account-content-container">
      <SettingContent />
      <AccountManagement />
      <DataManager />
    </div>
  );
  if (gameAccounts.length <= 0) content = <NoAccountWarning />;

  return <Container maxWidth="xl">{content}</Container>;
}

function AccountManagement() {
  const [editAccountId, setEditAccountId] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [name, setName] = useState("");
  const { dispatch } = useAppContext();
  const { getAllAccounts, addAccount, removeAccount, changeAccountName } = useGameAccount();
  const gameAccounts = getAllAccounts();

  function handleAddAccount() {
    if (name !== "") addAccount(crypto.randomUUID(), name);
    else addAccount(crypto.randomUUID(), randomName());
    setName("");
  }

  function addRandomAccount() {
    setName("");
    addAccount(crypto.randomUUID(), randomName());
  }

  function editAccount(id: string) {
    setEditAccountId(id);
    setNewAccountName("");
  }

  function handleRemoveAccount(id: string) {
    let subId = "";
    if (gameAccounts.length > 1) {
      const otherAccount = gameAccounts.find((account) => account.id !== id);
      if (otherAccount) subId = otherAccount.id;
    }
    removeAccount(id);
  }

  function handleUpdateAccountName(event: React.ChangeEvent<HTMLInputElement>) {
    setNewAccountName(event.target.value);
  }

  function handleAccountNameChange(originalName: string) {
    changeAccountName(
      editAccountId,
      newAccountName !== "" ? newAccountName : originalName,
    );
    setEditAccountId("");
    setNewAccountName("");
  }

  const accountListItems = gameAccounts.map((account) => {
    if (editAccountId !== account.id) {
      return (
        <div key={account.id} className="account-list-line-item grey-themed">
          <Typography color="white">{account.name}</Typography>
          <div>
            <IconButton
              aria-label="edit"
              onClick={() => editAccount(account.id)}
              size="small"
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => handleRemoveAccount(account.id)}
              size="small"
            >
              <DeleteIcon fontSize="inherit" color="error" />
            </IconButton>
          </div>
        </div>
      );
    }
    return (
      <div key={account.id} className="account-list-line-item">
        <div>
          <Input
            placeholder={account.name}
            value={newAccountName}
            onChange={handleUpdateAccountName}
          />
        </div>
        <div>
          <IconButton
            aria-label="edit"
            onClick={() => handleAccountNameChange(account.name)}
            size="small"
          >
            <DoneIcon fontSize="inherit" color="success" />
          </IconButton>
        </div>
      </div>
    );
  });

  return (
    <div className="account-manager-container">
      <div className="account-manager-header">账号管理</div>
      {accountListItems}
      <div className="container-add-account grey-themed">
        <TextField
          label="添加账号"
          variant="standard"
          value={name}
          onChange={(event) => setName(event.target.value)}
        ></TextField>
        <IconButton className="button-add-account" onClick={handleAddAccount}>
          <PersonAddIcon />
        </IconButton>
        <IconButton className="button-add-account" onClick={addRandomAccount}>
          <CasinoIcon />
        </IconButton>
      </div>
    </div>
  );
}

export function DataManager() {
  const { state } = useAppContext();
  // 假设我们在Context中有一个获取导出链接的方法
  const exportLink = state.exportLink || "#";

  function handleStateUpoad(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    // 假设我们在Context中有一个导入状态的方法
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === "string") {
        localStorage.setItem("state", event.target.result);
        window.location.reload();
      }
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="data-manager-header">数据管理</div>
      <div className="grey-themed">
        <Button component="label">
          导入数据
          <input type="file" hidden onChange={handleStateUpoad}></input>
        </Button>
        <Button href={exportLink} download>
          导出数据
        </Button>
      </div>
    </div>
  );
}

export function SettingContent() {
  return (
    <div>
      <div className="data-manager-header">登陆用户</div>
      {/*
            <Authenticator>
                {({ signOut }) => {
                    return (
                        <div className="grey-themed">
                            <div className="container-add-account">你好</div>
                            <Button onClick={signOut}>登出</Button>
                        </div>
                    );
                }}
            </Authenticator>
            */}
    </div>
  );
}

export default Setting;
