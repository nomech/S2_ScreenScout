import VerificationStatus from "../VerificationStatus/VerificationStatus";
import UserInofrmation from "../UserInofrmation/UserInofrmation";

// tHis component is used to render the settings page
const SettingsPage = () => {
    return (
        <>
            {/* The VerificationStatus component displays the user's verification status */}
            <VerificationStatus />
            <UserInofrmation />
        </>
    );
};

export default SettingsPage;
