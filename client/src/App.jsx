import { Route, Routes } from "react-router-dom";
import Layout from "./components/common-components/Layout";
import Home from "./components/common-components/Home";
import Recruiter_login from "./components/recruiter/recruiter_login";
import Recruiter_signup from "./components/recruiter/recruiter_signup";
import Candidate_signup from "./components/candidate/candidate_signup";
import Candidate_login from "./components/candidate/candidate_login";
import GlobalLoader from "./components/common-components/GlobalLoader";
import VerifyOtp from "./components/common-components/VerifyOtp";
import CandidateDashboard from "./components/candidate/CandidateDashboard";
import CandidateProfile from "./components/candidate/CandidateProfile";
import AuthHoc from "./components/common-components/AuthHoc";
import RecruiterDashboard from "./components/recruiter/RecruiterDashboard";
const ProtectedCandidateDashboard = AuthHoc(CandidateDashboard);
const ProtectedCandidateProfile = AuthHoc(CandidateProfile);
const ProtectedRecruiterDashboard=AuthHoc(RecruiterDashboard)
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="recruiter-login" element={<Recruiter_login />} />
          <Route path="recruiter-signup" element={<Recruiter_signup />} />
          <Route path="candidate-signup" element={<Candidate_signup />} />
          <Route path="candidate-login" element={<Candidate_login />} />
          <Route path="/verify-otp" element={<VerifyOtp />}></Route>
          <Route
            path="/candidate-dashboard"
            element={<ProtectedCandidateDashboard/>}
          ></Route>
          <Route
            path="/candidate-profile"
            element={<ProtectedCandidateProfile />}
          ></Route>

          <Route path="/recruiter-dashboard" element={<ProtectedRecruiterDashboard/>}></Route>
        </Route>
      </Routes>
      <GlobalLoader />
    </>
  );
}

export default App;
