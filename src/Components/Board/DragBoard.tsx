import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { boardState, contentState } from "../../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import DropContent from "../Content/DropContent";
import { useRecoilState, useSetRecoilState } from "recoil";
import React, { CSSProperties, useEffect, useRef, useState } from "react";

export const DragArea = styled.div<{ isDragging?: boolean }>`
    width: 250px;
    height: 400px;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 30px 1fr 40px;
    gap: 5px;
    margin: 0 10px 0 10px;
    padding: 20px 5px 5px 5px;
    box-shadow: ${(props) =>
        props.isDragging ? "2px 2px 10px black" : "2px 2px 10px darkgrey"};
`;
const TitleWrapper = styled.div<{ isOverflow?: boolean }>`
    display: flex;
    justify-content: ${(props) => (props.isOverflow ? "none" : "center")};
    align-items: center;
    ::-webkit-scrollbar {
        display: none;
    }
    overflow: scroll;
`;
const Title = styled.div<{ isOverflow?: boolean }>`
    display: flex;
    justify-content: ${(props) => (props.isOverflow ? "none" : "center")};
    align-items: center;
    width: 100%;
    height: 100%;
    font-weight: 600;
    font-size: 1.5em;
    ::-webkit-scrollbar {
        display: none;
    }
    overflow: scroll;
`;
const TitleInput = styled(Title)`
    text-align: center;
    border: 0;
    width: 100%;
    height: 100%;
    text-decoration: none;
    font-family: inherit;
    :focus {
        outline: 0;
    }
    background-color: transparent;
`;
const BoardNav = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 5px;
`;
const Icon: CSSProperties = {
    fontSize: "30px",
    color: "#337ea9",
    marginRight: "10px",
};

interface IDragBoardProps {
    dropBoardId: string;
    dragBoardId: string;
    index: number;
}
function DragBoard({ dropBoardId, dragBoardId, index }: IDragBoardProps) {
    // store of board and content
    const [boards, setBoards] = useRecoilState(boardState);
    const setContents = useSetRecoilState(contentState);
    // title hooks
    const [isOverflow, setIsOverflow] = useState(false);
    const refInput = useRef<HTMLInputElement>(null);
    const refTitle = useRef<HTMLDivElement>(null);
    const [titleText, setTitleText] = useState("");
    // create content event
    const createContent = () => {
        setContents((allContents) => {
            const cpContent = [...allContents[dragBoardId]];
            const newContent = {
                id: Date.now(),
                name: "",
                text: "",
                modify: true,
                dropId: dragBoardId,
                dragId: Date.now() + "",
            };
            return {
                ...allContents,
                [dragBoardId]: [newContent, ...cpContent],
            };
        });
    };
    // all deleting content event
    const allTrash = () =>
        setContents((allContents) => ({
            ...allContents,
            [dragBoardId]: [],
        }));
    // title over flow detection
    useEffect(() => {
        if (
            refTitle.current!.scrollWidth >
            refTitle.current!.getBoundingClientRect().width
        )
            setIsOverflow(true);
        else setIsOverflow(false);
    }, []);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBoards((allboards) => {
            const cpBoards = [...allboards[dropBoardId]];
            const cpBoard = { ...cpBoards[index] };
            cpBoard.name = titleText;
            cpBoards.splice(index, 1);
            cpBoards.splice(index, 0, cpBoard);
            return { ...allboards, [dropBoardId]: cpBoards };
        });
        onCancel();
    };
    const onChange = (e: React.FormEvent<HTMLInputElement>) =>
        setTitleText(e.currentTarget.value);
    const onCancel = () => {
        setBoards((allBoards) => {
            const cpBoards = [...allBoards[dropBoardId]];
            const cpBoard = { ...cpBoards[index] };
            cpBoard.modify = false;
            cpBoards.splice(index, 1);
            cpBoards.splice(index, 0, cpBoard);
            return { ...allBoards, [dropBoardId]: cpBoards };
        });
        setTitleText("");
    };
    const onTitleClick = () => {
        setBoards((allBoards) => {
            const cpBoards = [...allBoards[dropBoardId]];
            const cpBoard = { ...cpBoards[index] };
            cpBoard.modify = true;
            cpBoards.splice(index, 1);
            cpBoards.splice(index, 0, cpBoard);
            return { ...allBoards, [dropBoardId]: cpBoards };
        });
        setTimeout(() => {
            refInput.current?.focus();
        }, 10);
    };
    useEffect(() => {
        if (boards[dropBoardId][index].modify) {
            refInput.current?.focus();
        }
    }, []);
    return (
        <Draggable draggableId={dragBoardId} index={index}>
            {(boardDrag, sanpshot) => (
                <DragArea
                    ref={boardDrag.innerRef}
                    {...boardDrag.draggableProps}
                    {...boardDrag.dragHandleProps}
                    isDragging={sanpshot.isDragging}
                >
                    <TitleWrapper isOverflow={isOverflow}>
                        <form
                            onSubmit={onSubmit}
                            style={{
                                display: `${
                                    boards[dropBoardId][index].modify
                                        ? "inherit"
                                        : "none"
                                }`,
                            }}
                        >
                            <TitleInput
                                as="input"
                                type="text"
                                ref={refInput}
                                placeholder={
                                    boards[dropBoardId][index].name === ""
                                        ? `Title correction`
                                        : boards[dropBoardId][index].name
                                }
                                value={titleText}
                                onBlur={onCancel}
                                onChange={onChange}
                            />
                        </form>
                        <Title
                            isOverflow={isOverflow}
                            ref={refTitle}
                            style={{
                                display: `${
                                    boards[dropBoardId][index].modify
                                        ? "none"
                                        : "inherit"
                                }`,
                            }}
                            onClick={onTitleClick}
                        >
                            {boards[dropBoardId][index].name}
                        </Title>
                    </TitleWrapper>
                    <DropContent dropContentId={dragBoardId} />
                    <BoardNav>
                        <div></div>
                        <div>
                            <FontAwesomeIcon
                                style={Icon}
                                icon={faSquarePlus}
                                onClick={createContent}
                            />
                            <FontAwesomeIcon
                                style={Icon}
                                onClick={allTrash}
                                icon={faTrash}
                            />
                        </div>
                    </BoardNav>
                </DragArea>
            )}
        </Draggable>
    );
}

export default React.memo(DragBoard);
