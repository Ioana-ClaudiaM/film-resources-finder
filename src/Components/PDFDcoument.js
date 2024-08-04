const PDFDocument = () => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                {/* Afișează informațiile din prima secțiune */}
            </View>
            <View style={styles.section}>
                {/* Afișează informațiile din a doua secțiune */}
            </View>
            <View style={styles.section}>
                {/* Afișează informațiile din a treia secțiune */}
            </View>
        </Page>
    </Document>
);

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        margin: 10,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});
