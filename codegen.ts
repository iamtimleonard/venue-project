import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: './app/api/graphql/schema.graphql',
  generates: {
    "./app/api/graphql/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "./context#DataSourceContext"
      }
    }
  }
}

export default config
