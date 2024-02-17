package routes

import (
	"gabrieleromanato/drop-time-nic-it/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	baseURL = "https://www.nic.it/droptime/files/"
)

type DropTime struct {
	Domains []string `json:"domains"`
}

func HandleDropTimeRequest(c *gin.Context) {
	date := c.Param("date")
	url := baseURL + date + ".txt"
	content, err := utils.GetRemoteFileContent(url)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	domains := strings.Split(content, "\n")
	c.JSON(200, DropTime{Domains: domains})
}
