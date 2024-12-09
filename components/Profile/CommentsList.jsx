import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

const CommentsList = ({ userId }) => {
  const t = useTranslations("Profile");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchComments = async () => {
        try {
          const commentsRef = collection(
            db,
            "Users",
            userId,
            "FeedbackComment"
          );
          const q = query(commentsRef, where("createdAt", "!=", null));
          const querySnapshot = await getDocs(q);
          const commentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComments(commentsData);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      };

      fetchComments();
    }
  }, [userId]);

  return (
    <div className="w-full max-w-screen-xl mt-10 px-10">
      <Typography variant="h6" className="font-bold mb-4">
        {"comments"}
      </Typography>
      <List>
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography variant="h6" fontWeight="bold">
                    {comment.authorName}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body1"
                      color="text.primary"
                    >
                      {comment.text}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(comment.createdAt.toDate()).format("DD/MM/YYYY")}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default CommentsList;
