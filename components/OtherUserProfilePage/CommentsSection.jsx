import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { IoIosSend } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import dayjs from "dayjs";
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useTranslations } from "next-intl";

const CommentsSection = ({ id, comments, setComments, showAlert }) => {
  const t = useTranslations("Profile");
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      showAlert(t("commentLabelEmpty"));
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      showAlert("notLoggedInMessage");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
      const userName = userDoc.exists() ? userDoc.data().name : "Anonymous";

      await addDoc(collection(db, "Users", id, "FeedbackComment"), {
        text: comment,
        authorId: currentUser.uid,
        authorName: userName,
        createdAt: Timestamp.now(),
      });
      setComment("");
      showAlert(t("commentAddingSuccess"), "success");
    } catch (error) {
      showAlert(t("commentAddingError") + error.message);
    }
  };

  const handleCommentDelete = async (commentId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      showAlert(t("notLoggedInMessage"));
      return;
    }

    try {
      await deleteDoc(doc(db, "Users", id, "FeedbackComment", commentId));
      showAlert(t("commentDeletionSuccess"), "success");
    } catch (error) {
      showAlert(t("commentDeletionError") + error.message);
    }
  };

  const handleEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const handleSaveEditedComment = async () => {
    if (!editingCommentText.trim()) {
      showAlert(t("commentLabelEmpty"));
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      showAlert(t("notLoggedInMessage"));
      return;
    }

    try {
      await updateDoc(
        doc(db, "Users", id, "FeedbackComment", editingCommentId),
        {
          text: editingCommentText,
        }
      );
      setEditingCommentId(null);
      setEditingCommentText("");
      showAlert(t("commentEditingSuccess"), "success");
    } catch (error) {
      showAlert(t("commentEditingError") + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center mt-6 w-[1024px]">
        <TextField
          label={t("userCommentLabel")}
          variant="standard"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
        />
        <IconButton color="primary" onClick={handleCommentSubmit}>
          <IoIosSend />
        </IconButton>
      </div>

      <div className="mt-6 w-[1024px]">
        <h2 className="text-2xl font-bold">{t("userCommentsSection")}</h2>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-[#e9b08254] p-4 rounded-xl mt-4 flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{comment.authorName}</div>
              {editingCommentId === comment.id ? (
                <TextField
                  value={editingCommentText}
                  onChange={(e) => setEditingCommentText(e.target.value)}
                  variant="outlined"
                  fullWidth
                />
              ) : (
                <div>{comment.text}</div>
              )}
              <div className="text-sm text-gray-500">
                {dayjs(comment.createdAt.toDate()).format("DD/MM/YYYY")}
              </div>
            </div>
            {auth.currentUser && auth.currentUser.uid === comment.authorId && (
              <div>
                {editingCommentId === comment.id ? (
                  <IconButton color="primary" onClick={handleSaveEditedComment}>
                    <FaCheck />
                  </IconButton>
                ) : (
                  <IconButton
                    color="primary"
                    onClick={() => handleEditComment(comment.id, comment.text)}
                  >
                    <MdEdit />
                  </IconButton>
                )}
                <IconButton
                  color="error"
                  onClick={() => handleCommentDelete(comment.id)}
                >
                  <MdDelete />
                </IconButton>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
