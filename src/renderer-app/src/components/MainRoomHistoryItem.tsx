import { Button, Dropdown, Menu } from "antd";
import { format, isToday, isTomorrow } from "date-fns";
import { zhCN } from "date-fns/locale";
import React from "react"
import { Link } from "react-router-dom";
import { getUserUuid } from "../utils/localStorage/accounts";
import { Identity } from "../utils/localStorage/room";

export type MainRoomListItemProps = {
    showDate: boolean;
    /** 标题 */
    title: string;
    /** 开始时间 (UTC 时间戳) */
    beginTime: number;
    /** 结束时间 (UTC 时间戳) */
    endTime?: number;
    /** 周期 uuid */
    periodicUUID: string;
    /** 房间 uuid */
    roomUUID: string;
    /** 发起者 userUUID */
    userUUID: string;

    historyPush: (path: string) => void;
}

export default class MainRoomHistoryItem extends React.PureComponent<MainRoomListItemProps> {
    public renderMenu = () => (
        <Menu>
            <Menu.Item>
                <Link
                    to={{
                        pathname: "/user/room/",
                        state: {
                            roomUUID: this.props.roomUUID,
                            periodicUUID: this.props.periodicUUID,
                            userUUID: this.props.userUUID,
                        },
                    }}
                >
                    房间详情
                </Link>
            </Menu.Item>
            <Menu.Item>删除记录</Menu.Item>
        </Menu>
    );

    public renderDate = () => {
        const { beginTime } = this.props;
        return (
            <time dateTime={new Date(beginTime).toUTCString()}>
                {format(beginTime, "MMMM do", { locale: zhCN })}
                {isToday(beginTime) && " 今天"}
                {isTomorrow(beginTime) && " 明天"}
            </time>
        );
    };

    public renderDuration = () => {
        return (
            <>
                <span>{format(this.props.beginTime, "HH:mm")}</span>
                <span> ~ </span>
                {this.props.endTime && <span>{format(this.props.endTime, "HH:mm")}</span>}
            </>
        );
    };

    public getIdentity = () => {
        return getUserUuid() === this.props.userUUID ? Identity.creator : Identity.joiner;
    };

    private gotoReplay = async () => {
        const { roomUUID } = this.props
        const identity = this.getIdentity();
        const url = `/replay/${identity}/${roomUUID}/${getUserUuid()}/`;
        this.props.historyPush(url);
    }

    render() {
        return (
            <div className="room-list-cell-item">
                {this.props.showDate && (
                    <div className="room-list-cell-day">
                        <div className="room-list-cell-modify" />
                        <div className="room-list-cell-title">{this.renderDate()}</div>
                    </div>
                )}
                <div className="room-list-cell">
                    <div className="room-list-cell-left">
                        <div className="room-list-cell-name">{this.props.title}</div>
                        <div className="room-list-cell-state"><span className="room-stopped">已结束</span></div>
                        <div className="room-list-cell-time">{this.renderDuration()}</div>
                    </div>
                    <div className="room-list-cell-right">
                        <Dropdown overlay={this.renderMenu()}>
                            <Button className="room-list-cell-more">更多</Button>
                        </Dropdown>
                        <Button
                            className="room-list-cell-enter"
                            type="primary"
                            onClick={this.gotoReplay}
                        >
                            查看回放
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
