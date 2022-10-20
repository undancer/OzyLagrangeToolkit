import { Container, Card, Button } from "@mui/material";
import { useAppDispatch } from "../redux/utils/hooks";
import { addAccount } from "../redux/actions/game-account";
import { randomName } from "./utils/randomName";

function NoAccountWarning(): JSX.Element {
    const dispatch = useAppDispatch();

    return (
        <Container maxWidth={false} className={"container-main-blue-print"}>
            <div className="account-content-container">
                <Card elevation={0} className="account-title-card">
                    还没有账号啊，点击右上的 “账户管理” 填加一个吧。
                </Card>
                <Card elevation={0} className="account-title-card">
                    或点击这里创建一个
                    <Button variant="outlined" size="small" onClick={() => dispatch(addAccount(randomName()))}>
                        随机账号
                    </Button>
                </Card>
            </div>
        </Container>
    );
}

export default NoAccountWarning;
