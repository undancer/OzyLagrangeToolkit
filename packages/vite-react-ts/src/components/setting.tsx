import React, { useState } from "react";
import { DeleteIcon } from "./svg/delete-icon";
import { EditIcon } from "./svg/edit-icon";
import { DoneIcon } from "./svg/done-icon";
import { CasinoIcon } from "./svg/casino-icon";
import { PersonAddIcon } from "./svg/person-add-icon";
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

  return <div className="container mx-auto px-4">{content}</div>;
}

function AccountManagement() {
  const [editAccountId, setEditAccountId] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [name, setName] = useState("");
  const { dispatch } = useAppContext();
  const { getAllAccounts, addAccount, removeAccount, changeAccountName } =
    useGameAccount();
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
          <p className="text-white">{account.name}</p>
          <div>
            <button
              aria-label="edit"
              onClick={() => editAccount(account.id)}
              className="p-1 rounded-full text-gray-300 hover:bg-gray-700"
            >
              <EditIcon className="text-sm" />
            </button>
            <button
              aria-label="delete"
              onClick={() => handleRemoveAccount(account.id)}
              className="p-1 rounded-full text-red-500 hover:bg-red-100"
            >
              <DeleteIcon className="text-sm" />
            </button>
          </div>
        </div>
      );
    }
    return (
      <div key={account.id} className="account-list-line-item">
        <div>
          <input
            className="px-2 py-1 border border-gray-300 rounded"
            placeholder={account.name}
            value={newAccountName}
            onChange={handleUpdateAccountName}
          />
        </div>
        <div>
          <button
            aria-label="edit"
            onClick={() => handleAccountNameChange(account.name)}
            className="p-1 rounded-full text-green-500 hover:bg-green-100"
          >
            <DoneIcon className="text-sm" />
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="account-manager-container">
      <div className="account-manager-header">账号管理</div>
      {accountListItems}
      <div className="container-add-account grey-themed">
        <input
          className="px-2 py-1 border-b border-gray-300 bg-transparent focus:outline-none"
          placeholder="添加账号"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button
          className="button-add-account p-1 rounded-full hover:bg-gray-700"
          onClick={handleAddAccount}
        >
          <PersonAddIcon />
        </button>
        <button
          className="button-add-account p-1 rounded-full hover:bg-gray-700"
          onClick={addRandomAccount}
        >
          <CasinoIcon />
        </button>
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
        <label className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
          导入数据
          <input type="file" className="hidden" onChange={handleStateUpoad} />
        </label>
        <a
          href={exportLink}
          download
          className="inline-block ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          导出数据
        </a>
      </div>
    </div>
  );
}

export function SettingContent() {
  return (
    <div>
      <div className="data-manager-header">登陆用户</div>
    </div>
  );
}

export default Setting;
