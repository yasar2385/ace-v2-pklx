import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CHAT_BASE_URL } from "../../config";

export function Chat() {

  const location = useLocation();
  const [user_id, setUserId] = useState(
    JSON.parse(localStorage.getItem("user")!).user_id || ""
  );
  useEffect(() => {
    document.title = "Chat - ACE PICKL"
  }, [])
  return (
    <div className="container-fluid g-0">
      <div className="row g-0">
        <div className="col-12">
          <div className="position-relative">
            <Link to={'/ap/club-league/clubs'} className="btn btn-sm btn-danger position-absolute" style={{ top: "30px", left: "10px" }}>Close</Link>
            <iframe src={`${CHAT_BASE_URL}/?group_id=${location.state.groupId}&user_id=${user_id}`} className="chatIFrame"></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
