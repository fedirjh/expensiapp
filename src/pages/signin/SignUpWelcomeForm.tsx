import React, {useMemo} from 'react';
import {View} from 'react-native';
import Button from '@components/Button';
import FormHelpMessage from '@components/FormHelpMessage';
import useLocalize from '@hooks/useLocalize';
import useNetwork from '@hooks/useNetwork';
import useOnyx from '@hooks/useOnyx';
import useThemeStyles from '@hooks/useThemeStyles';
import {getLatestErrorMessage} from '@libs/ErrorUtils';
import {setReadyToShowAuthScreens} from '@userActions/HybridApp';
import {clearSignInData, signUpUser} from '@userActions/Session';
import ONYXKEYS from '@src/ONYXKEYS';
import ChangeExpensifyLoginLink from './ChangeExpensifyLoginLink';
import Terms from './Terms';

type SignUpWelcomeFormProps = {
    userLogin?: string;
};

function SignUpWelcomeForm({userLogin}: SignUpWelcomeFormProps) {
    const network = useNetwork();
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const [account] = useOnyx(ONYXKEYS.ACCOUNT, {canBeMissing: false});
    const [preferredLocale] = useOnyx(ONYXKEYS.NVP_PREFERRED_LOCALE, {canBeMissing: true});
    const serverErrorText = useMemo(() => {
        const errorMessage = account ? getLatestErrorMessage(account) : '';
        if (errorMessage === '402 Invalid TLD') {
            const tld = userLogin?.split('.').pop();
            return `The email domain extension .${tld} is invalid. Please try again with a valid one. Thanks!`;
        }
        return errorMessage;
    }, [account, userLogin]);

    return (
        <>
            <View style={[styles.mt3, styles.mb2]}>
                <Button
                    isDisabled={network.isOffline || !!account?.message}
                    success
                    large
                    text={translate('welcomeSignUpForm.join')}
                    isLoading={account?.isLoading}
                    onPress={() => {
                        signUpUser(preferredLocale);
                        setReadyToShowAuthScreens(true);
                    }}
                    pressOnEnter
                    style={[styles.mb2]}
                />
                {!!serverErrorText && (
                    <FormHelpMessage
                        isError
                        message={serverErrorText}
                    />
                )}
                <ChangeExpensifyLoginLink onPress={() => clearSignInData()} />
            </View>
            <View style={[styles.mt4, styles.signInPageWelcomeTextContainer]}>
                <Terms />
            </View>
        </>
    );
}

export default SignUpWelcomeForm;
