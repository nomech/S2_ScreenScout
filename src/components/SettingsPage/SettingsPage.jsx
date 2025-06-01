import VerificationStatus from "../VerificationStatus/VerificationStatus";
import UserInofrmation from "../UserInofrmation/UserInofrmation";
import Button from "../Button/Button";
/* import { authenticateWithTmdb } from "../../utils/linkAccountwithTmdb"; */
// this component is used to render the settings page
const SettingsPage = () => {
    const handleTest = async () => {
        try {
            console.log("fetching");
            const response = await fetch("http://localhost:3001/allow");
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            {/* The VerificationStatus component displays the user's verification status */}
            <VerificationStatus />
            <UserInofrmation />
            <Button onClick={handleTest}>Link Account with TMDB</Button>
        </>
    );
};

export default SettingsPage;
