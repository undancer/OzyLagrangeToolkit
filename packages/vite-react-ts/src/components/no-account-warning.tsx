import { useGameAccount } from "../context";
import { randomName } from "./utils/randomName";
import React from "react";
import { Container } from "./ui/container";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

function NoAccountWarning(): React.JSX.Element {
  const { addAccount } = useGameAccount();

  return (
    <Container maxWidth={false} className="container-main-blue-print">
      <div className="account-content-container">
        <Card elevation={0} className="account-title-card">
          还没有账号啊，点击右上的 "账户管理" 填加一个吧。
        </Card>
        <Card elevation={0} className="account-title-card">
          或点击这里创建一个
          <Button
            variant="outlined"
            size="small"
            onClick={() => addAccount(crypto.randomUUID(), randomName())}
          >
            随机账号
          </Button>
        </Card>
      </div>
    </Container>
  );
}

export default NoAccountWarning;
