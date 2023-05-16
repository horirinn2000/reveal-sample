import express, { Application } from 'express';
import reveal, { IRVUserContext, RevealOptions, RVDashboardDataSource, RVDataSourceItem, RVMySqlDataSource, RVMySqlDataSourceItem, RVPostgresDataSource, RVPostgresDataSourceItem, RVUsernamePasswordDataSourceCredential } from 'reveal-sdk-node';
import cors from "cors";

const app: Application = express();

app.use(cors());

const authenticationProvider = async (userContext: IRVUserContext | null, dataSource: RVDashboardDataSource) => {
	if (dataSource instanceof RVMySqlDataSource) {
		return new RVUsernamePasswordDataSourceCredential(process.env.MYSQL_DB_USER!, process.env.MYSQL_DB_PASS!);
	}
  	if (dataSource instanceof RVPostgresDataSource) {
		return new RVUsernamePasswordDataSourceCredential(process.env.POSTGRESQL_DB_USER!, process.env.POSTGRESQL_DB_PASS!);
	}
	return null;
}

const dataSourceItemProvider = async (userContext: IRVUserContext | null, dataSourceItem: RVDataSourceItem) => {
	if (dataSourceItem instanceof RVMySqlDataSourceItem) {

		//update underlying data source
		dataSourceProvider(userContext, dataSourceItem.dataSource);

		//only change the table if we have selected our data source item
		if (dataSourceItem.id === "MySQLServerDataSourceItem") {
			dataSourceItem.table = process.env.MYSQL_DB_TABLE!;
		}
	}

  if (dataSourceItem instanceof RVPostgresDataSourceItem) {

		//update underlying data source
		dataSourceProvider(userContext, dataSourceItem.dataSource);

		//only change the table if we have selected our data source item
		if (dataSourceItem.id === "PostgreSQLServerDataSourceItem") {
			dataSourceItem.table = process.env.POSTGRESQL_DB_TABLE!;
		}
	}

	return dataSourceItem;
}

const dataSourceProvider = async (userContext: IRVUserContext | null, dataSource: RVDashboardDataSource) => {
	
	if (dataSource instanceof RVMySqlDataSource) {
      dataSource.host = process.env.MYSQL_DB_HOST!;
      dataSource.database = process.env.MYSQL_DB_DATABASE!;
	}
	if (dataSource instanceof RVPostgresDataSource) {
		dataSource.host = process.env.POSTGRESQL_DB_HOST!;
		dataSource.database = process.env.POSTGRESQL_DB_DATABASE!;
	}
	return dataSource;
}

const revealOptions: RevealOptions = {
    localFileStoragePath: "data",
	authenticationProvider: authenticationProvider,
	dataSourceProvider: dataSourceProvider,
	dataSourceItemProvider: dataSourceItemProvider,
}

app.use('/', reveal(revealOptions));

app.listen(8080, () => {
    console.log(`Reveal server accepting http requests`);
});